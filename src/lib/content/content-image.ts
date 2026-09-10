export type ContentImage = {
  alt?: string;
  height?: number;
  url: string;
  width?: number;
};

type ImageSource = ContentImage | string | undefined | null;

class ContentImageUrlBuilder {
  constructor(private readonly source: ImageSource) {}

  width(value: number) {
    void value;
    return this;
  }

  height(value: number) {
    void value;
    return this;
  }

  url() {
    if (typeof this.source === "string") return this.source;
    return this.source?.url ?? "";
  }
}

export function urlFor(source: ImageSource) {
  return new ContentImageUrlBuilder(source);
}
