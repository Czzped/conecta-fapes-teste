const GITHUB_API_URL = "https://api.github.com";
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

export interface GitHubRestResponse<TData> {
  status: number;
  ok: boolean;
  data: TData | null;
}

interface GitHubRestClientOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  baseUrl?: string;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

function isRetriableStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function parseBody<TData>(body: string): TData | null {
  if (!body) {
    return null;
  }

  try {
    return JSON.parse(body) as TData;
  } catch {
    return null;
  }
}

/**
 * Cliente REST minimo da API do GitHub, usado pelas automacoes de Git Flow
 * (refs, branches, PRs e tags). Diferente do cliente GraphQL, ele NAO lanca
 * excecao em respostas 4xx: retorna `{ status, ok, data }` para que o gateway
 * trate idempotencia (404 = nao existe, 422 = ja existe) sem `try/catch`.
 * Apenas falhas 5xx sao reenviadas (retry) e, esgotadas as tentativas, lancam.
 */
export class GitHubRestClient {
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private readonly baseUrl: string;

  constructor(
    private readonly accessToken: string,
    private readonly userAgent: string,
    options: GitHubRestClientOptions = {}
  ) {
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
    this.baseUrl = options.baseUrl ?? GITHUB_API_URL;
  }

  async request<TData>(
    method: HttpMethod,
    path: string,
    body?: unknown
  ): Promise<GitHubRestResponse<TData>> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;

    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "User-Agent": this.userAgent,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      if (isRetriableStatus(response.status) && attempt < this.maxRetries) {
        await delay(this.retryDelayMs * (attempt + 1));
        continue;
      }

      const text = await response.text();

      if (response.status >= 500) {
        throw new Error(`github rest failed: ${response.status} ${text}`);
      }

      return {
        status: response.status,
        ok: response.ok,
        data: parseBody<TData>(text),
      };
    }

    throw new Error("github rest failed after retries");
  }
}
