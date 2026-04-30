interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="px-4 md:px-8 py-8">
      <h1 
        className="mb-4"
        style={{
          color: 'var(--foreground)',
        }}
      >
        {title}
      </h1>
      <p style={{ color: 'var(--muted-foreground)' }}>
        {description}
      </p>
    </div>
  );
}
