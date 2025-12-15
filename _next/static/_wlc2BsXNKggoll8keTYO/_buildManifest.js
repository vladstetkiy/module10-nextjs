self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/module10-nextjs/module10-nextjs/mockServiceWorker.js",
        "destination": "/module10-nextjs/mockServiceWorker.js"
      }
    ],
    "beforeFiles": [
      {
        "source": "/module10-nextjs//_next/:path+",
        "destination": "/module10-nextjs/_next/:path+"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()