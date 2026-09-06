import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        <title>
          Combined Events Points Calculator | Decathlon, Heptathlon, Pentathlon
        </title>
        <meta
          name="description"
          content="Calculate points for Decathlon, Heptathlon, and Pentathlon events. Track your performance and compare with World Athletics standards."
        />
        <meta name="theme-color" content="#D35400" />
        <link rel="canonical" href="https://decathlonpoints.com/" />

        <ScrollViewStyleReset />

        <style id="web-zoom-reset">
          {`
            html,
            body {
              touch-action: manipulation;
              -webkit-text-size-adjust: 100%;
            }
            input,
            textarea {
              font-size: 16px;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
