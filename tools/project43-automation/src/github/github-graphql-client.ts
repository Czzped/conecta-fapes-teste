const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

interface GraphqlError {
  message?: string;
}

interface GraphqlResponse<TData> {
  data?: TData;
  errors?: GraphqlError[];
}

export class GitHubGraphqlClient {
  constructor(
    private readonly accessToken: string,
    private readonly userAgent: string
  ) {}

  async request<TData>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<TData> {
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

    const payload = (await response.json()) as GraphqlResponse<TData>;

    if (!response.ok || payload.errors?.length || !payload.data) {
      throw new Error(
        `github graphql failed: ${response.status} ${JSON.stringify(
          payload.errors ?? payload
        )}`
      );
    }

    return payload.data;
  }
}
