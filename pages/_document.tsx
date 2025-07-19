// pages/_document.tsx
import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v15-pagesRouter";
import createCache from "@emotion/cache";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    return documentGetInitialProps(ctx, {
      emotionCache: createCache({
        key: "css",
        prepend: true,
      }),
    });
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <DocumentHeadTags emotionStyleTags={[]} {...this.props} />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
