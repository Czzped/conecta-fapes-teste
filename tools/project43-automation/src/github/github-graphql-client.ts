const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

interface GraphqlError {
  message?: string;
}

interface GraphqlResponse<TData> {
  data?: TData;
  errors?: GraphqlError[];
  message?: string;
  rawBody?: string;
}

interface GitHubGraphqlClientOptions {
  maxRetries?: number;
  retryDelayMs?: number;
}

function isRetriableStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function parsePayload<TData>(body: string): GraphqlResponse<TData> {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body) as GraphqlResponse<TData>;
  } catch {
    return { rawBody: body };
  }
}

export class GitHubGraphqlClient {
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;

  constructor(
    private readonly accessToken: string,
    private readonly userAgent: string,
    options: GitHubGraphqlClientOptions = {}
  ) {
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
  }

  async request<TData>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<TData> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "User-Agent": this.userAgent,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ query, variables }),
      });

      const body = await response.text();
      const payload = parsePayload<TData>(body);

      if (response.ok && !payload.errors?.length && payload.data) {
        return payload.data;
      }

      const canRetry =
        isRetriableStatus(response.status) && attempt < this.maxRetries;

      if (canRetry) {
        await delay(this.retryDelayMs * (attempt + 1));
        continue;
      }

      throw new Error(
        `github graphql failed: ${response.status} ${JSON.stringify(
          payload.errors ?? payload
        )}`
      );
    }

    throw new Error("github graphql failed after retries");
  }
}
