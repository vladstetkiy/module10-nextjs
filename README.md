This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

-----------------------------|---------|----------|---------|---------|--------------------------------------File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|--------------------------------------All files                    |   66.11 |    57.19 |      50 |   66.73 |                                      
 app                         |   41.66 |        0 |       0 |   43.47 |                                      
  providers.tsx              |   41.66 |        0 |       0 |   43.47 | 22-43                                
 components/AuthPage         |   76.66 |    65.78 |      60 |   76.66 |                                      
  AuthForm.tsx               |   76.66 |    65.78 |      60 |   76.66 | 43,47,54,69-75,84,91,96,109,121-139  
 components/Button           |     100 |      100 |     100 |     100 |                                      
  Button.tsx                 |     100 |      100 |     100 |     100 |                                      
 components/Input            |   81.81 |    68.75 |   33.33 |      90 |                                      
  Input.tsx                  |   81.81 |    68.75 |   33.33 |      90 | 68                                   
 components/ListCard         |   85.71 |       75 |     100 |   85.71 |                                      
  ListCard.tsx               |   85.71 |       75 |     100 |   85.71 | 22-23                                
 components/MetricCard       |     100 |      100 |     100 |     100 |                                      
  MetricCard.tsx             |     100 |      100 |     100 |     100 |                                      
 components/PersonShortInfo  |      85 |       80 |   33.33 |      85 |                                      
  PersonShortInfo.tsx        |      85 |       80 |   33.33 |      85 | 31,43,49                             
 components/Post             |     100 |       40 |     100 |     100 |                                      
  Post.tsx                   |     100 |       40 |     100 |     100 | 11-13                                
 components/PostReactions    |   66.66 |    60.71 |   42.85 |      70 |                                      
  PostReactions.tsx          |   66.66 |    60.71 |   42.85 |      70 | ...61,66-73,80,97-99,103-114,122,174 
 components/PushNotification |     100 |      100 |     100 |     100 |                                      
  PushNotification.tsx       |     100 |      100 |     100 |     100 |                                      
 components/TableChart       |    92.1 |    95.83 |   85.71 |   91.17 |                                      
  TableChart.tsx             |    92.1 |    95.83 |   85.71 |   91.17 | 68,175-232                           
 components/Toggle           |     100 |       75 |     100 |     100 |                                      
  Toggle.tsx                 |     100 |       75 |     100 |     100 | 81-85                                
 components/svg/CommentSvg   |     100 |      100 |     100 |     100 |                                      
  CommentSvg.tsx             |     100 |      100 |     100 |     100 |                                      
 components/svg/CrossSvg     |     100 |      100 |     100 |     100 |                                      
  CrossSvg.tsx               |     100 |      100 |     100 |     100 |                                      
 components/svg/EyeSvg       |     100 |      100 |     100 |     100 |                                      
  EyeSvg.tsx                 |     100 |      100 |     100 |     100 |                                      
 components/svg/InfoSvg      |      50 |      100 |       0 |      50 |                                      
  InfoSvg.tsx                |      50 |      100 |       0 |      50 | 6                                    
 components/svg/LikeSvg      |     100 |       50 |     100 |     100 |                                      
  LikeSvg.tsx                |     100 |       50 |     100 |     100 | 14                                   
 components/svg/MailSvg      |     100 |      100 |     100 |     100 |                                      
  MailSvg.tsx                |     100 |      100 |     100 |     100 |                                      
 components/svg/PenSvg       |     100 |      100 |     100 |     100 |                                      
  PenSvg.tsx                 |     100 |      100 |     100 |     100 |                                      
 components/svg/RowSvg       |     100 |      100 |     100 |     100 |                                      
  RowSvg.tsx                 |     100 |      100 |     100 |     100 |                                      
 components/svg/TrashSvg     |     100 |      100 |     100 |     100 |                                      
  TrashSvg.tsx               |     100 |      100 |     100 |     100 |                                      
 contexts                    |   33.33 |        0 |   14.28 |   31.81 |                                      
  MockProvider.tsx           |   22.22 |        0 |       0 |   17.64 | 7-32                                 
  ThemeContext.tsx           |   66.66 |      100 |   33.33 |      80 | 15                                   
 slices                      |   39.21 |    41.66 |    37.5 |   39.21 |                                      
  authSlice.ts               |   39.21 |    41.66 |    37.5 |   39.21 | 24,36-43,50-62,70-81,87-91,102-119   
 store                       |     100 |      100 |     100 |     100 |                                      
  index.ts                   |     100 |      100 |     100 |     100 |                                      
 types                       |   80.95 |      100 |      20 |     100 |                                      
  post.types.ts              |   80.95 |      100 |      20 |     100 |                                      
 utils                       |    31.5 |     6.66 |    7.14 |   31.94 |                                      
  config.ts                  |     100 |      100 |     100 |     100 |                                      
  libApi.ts                  |   27.53 |     2.32 |    7.14 |   27.94 | 9-13,19-20,25-141                    
-----------------------------|---------|----------|---------|---------|--------------------------------------
 components/svg/LikeSvg      |     100 |       50 |     100 |     100 |
  LikeSvg.tsx                |     100 |       50 |     100 |     100 | 14
 components/svg/MailSvg      |     100 |      100 |     100 |     100 |
  MailSvg.tsx                |     100 |      100 |     100 |     100 |
 components/svg/PenSvg       |     100 |      100 |     100 |     100 |
  PenSvg.tsx                 |     100 |      100 |     100 |     100 |
 components/svg/RowSvg       |     100 |      100 |     100 |     100 |
  RowSvg.tsx                 |     100 |      100 |     100 |     100 |
 components/svg/TrashSvg     |     100 |      100 |     100 |     100 |
  TrashSvg.tsx               |     100 |      100 |     100 |     100 |
 contexts                    |   33.33 |        0 |   14.28 |   31.81 |
  MockProvider.tsx           |   22.22 |        0 |       0 |   17.64 | 7-32
  ThemeContext.tsx           |   66.66 |      100 |   33.33 |      80 | 15
 slices                      |   39.21 |    41.66 |    37.5 |   39.21 |
  authSlice.ts               |   39.21 |    41.66 |    37.5 |   39.21 | 24,36-43,50-62,70-81,87-91,102-119   
 store                       |     100 |      100 |     100 |     100 |
  index.ts                   |     100 |      100 |     100 |     100 |
 types                       |   80.95 |      100 |      20 |     100 |
  post.types.ts              |   80.95 |      100 |      20 |     100 |
 utils                       |    31.5 |     6.66 |    7.14 |   31.94 |
  config.ts                  |     100 |      100 |     100 |     100 |
  libApi.ts                  |   27.53 |     2.32 |    7.14 |   27.94 | 9-13,19-20,25-141
-----------------------------|---------|----------|---------|---------|--------------------------------------

  MailSvg.tsx                |     100 |      100 |     100 |     100 |
 components/svg/PenSvg       |     100 |      100 |     100 |     100 |
  PenSvg.tsx                 |     100 |      100 |     100 |     100 |
 components/svg/RowSvg       |     100 |      100 |     100 |     100 |
  RowSvg.tsx                 |     100 |      100 |     100 |     100 |
 components/svg/TrashSvg     |     100 |      100 |     100 |     100 |
  TrashSvg.tsx               |     100 |      100 |     100 |     100 |
 contexts                    |   33.33 |        0 |   14.28 |   31.81 |
  MockProvider.tsx           |   22.22 |        0 |       0 |   17.64 | 7-32
  ThemeContext.tsx           |   66.66 |      100 |   33.33 |      80 | 15
 slices                      |   39.21 |    41.66 |    37.5 |   39.21 |
  authSlice.ts               |   39.21 |    41.66 |    37.5 |   39.21 | 24,36-43,50-62,70-81,87-91,102-119   
 store                       |     100 |      100 |     100 |     100 |
  index.ts                   |     100 |      100 |     100 |     100 |
 types                       |   80.95 |      100 |      20 |     100 |
  post.types.ts              |   80.95 |      100 |      20 |     100 |
 utils                       |    31.5 |     6.66 |    7.14 |   31.94 |
  config.ts                  |     100 |      100 |     100 |     100 |
  libApi.ts                  |   27.53 |     2.32 |    7.14 |   27.94 | 9-13,19-20,25-141
-----------------------------|---------|----------|---------|---------|--------------------------------------

  TrashSvg.tsx               |     100 |      100 |     100 |     100 |
 contexts                    |   33.33 |        0 |   14.28 |   31.81 |
  MockProvider.tsx           |   22.22 |        0 |       0 |   17.64 | 7-32
  ThemeContext.tsx           |   66.66 |      100 |   33.33 |      80 | 15
 slices                      |   39.21 |    41.66 |    37.5 |   39.21 |
  authSlice.ts               |   39.21 |    41.66 |    37.5 |   39.21 | 24,36-43,50-62,70-81,87-91,102-119   
 store                       |     100 |      100 |     100 |     100 |
  index.ts                   |     100 |      100 |     100 |     100 |
 types                       |   80.95 |      100 |      20 |     100 |
  post.types.ts              |   80.95 |      100 |      20 |     100 |
 utils                       |    31.5 |     6.66 |    7.14 |   31.94 |
  config.ts                  |     100 |      100 |     100 |     100 |
  libApi.ts                  |   27.53 |     2.32 |    7.14 |   27.94 | 9-13,19-20,25-141
-----------------------------|---------|----------|---------|---------|--------------------------------------

Test Suites: 11 passed, 11 total
  libApi.ts                  |   27.53 |     2.32 |    7.14 |   27.94 | 9-13,19-20,25-141
-----------------------------|---------|----------|---------|---------|--------------------------------------

Test Suites: 11 passed, 11 total
Test Suites: 11 passed, 11 total
Snapshots:   0 total
Time:        14.866 s
