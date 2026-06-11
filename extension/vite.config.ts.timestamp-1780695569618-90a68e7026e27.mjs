// vite.config.ts
import { defineConfig } from "file:///Users/nischalkotamraju/Desktop/rex/extension/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nischalkotamraju/Desktop/rex/extension/node_modules/@vitejs/plugin-react/dist/index.js";
import { crx } from "file:///Users/nischalkotamraju/Desktop/rex/extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Rex",
  version: "1.0.0",
  description: "Never forget important emails again.",
  permissions: ["storage", "tabs"],
  host_permissions: ["https://mail.google.com/*", "http://localhost:3001/*"],
  externally_connectable: {
    matches: [
      "https://getrex.ai/*",
      "http://localhost:3000/*"
    ]
  },
  content_scripts: [
    {
      matches: ["https://mail.google.com/*"],
      js: ["src/content/index.tsx"],
      css: [],
      run_at: "document_idle",
      all_frames: false
    }
  ],
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module"
  },
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Rex",
    default_icon: {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  web_accessible_resources: [
    {
      resources: ["icons/*"],
      matches: ["https://mail.google.com/*"]
    }
  ]
};

// vite.config.ts
var isProd = process.env.NODE_ENV === "production";
var useLocalUrls = process.env.LOCAL_URLS === "true" || !isProd;
var vite_config_default = defineConfig({
  define: {
    __SERVER_URL__: JSON.stringify(
      useLocalUrls ? "http://localhost:3001" : "https://rex-server.up.railway.app"
    ),
    __WEBSITE_URL__: JSON.stringify(
      useLocalUrls ? "http://localhost:3000" : "https://getrex.ai"
    ),
    __SUPABASE_URL__: JSON.stringify("https://xncywsarjinlmuqvffop.supabase.co"),
    __SUPABASE_ANON_KEY__: JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3l3c2FyamlubG11cXZmZm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzQyMDMsImV4cCI6MjA5NDYxMDIwM30.-EF3l-1O-eXLbjYfC3G56Pi_Di2ZrJ17ASDRC9tsAxE")
  },
  plugins: [
    react(),
    crx({ manifest: manifest_default })
  ],
  build: {
    minify: false,
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9uaXNjaGFsa290YW1yYWp1L0Rlc2t0b3AvcmV4L2V4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL25pc2NoYWxrb3RhbXJhanUvRGVza3RvcC9yZXgvZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uaXNjaGFsa290YW1yYWp1L0Rlc2t0b3AvcmV4L2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5qc29uJ1xuXG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXG5jb25zdCB1c2VMb2NhbFVybHMgPSBwcm9jZXNzLmVudi5MT0NBTF9VUkxTID09PSAndHJ1ZScgfHwgIWlzUHJvZFxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBkZWZpbmU6IHtcbiAgICBfX1NFUlZFUl9VUkxfXzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICB1c2VMb2NhbFVybHMgPyAnaHR0cDovL2xvY2FsaG9zdDozMDAxJyA6ICdodHRwczovL3JleC1zZXJ2ZXIudXAucmFpbHdheS5hcHAnXG4gICAgKSxcbiAgICBfX1dFQlNJVEVfVVJMX186IEpTT04uc3RyaW5naWZ5KFxuICAgICAgdXNlTG9jYWxVcmxzID8gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcgOiAnaHR0cHM6Ly9nZXRyZXguYWknXG4gICAgKSxcbiAgICBfX1NVUEFCQVNFX1VSTF9fOiBKU09OLnN0cmluZ2lmeSgnaHR0cHM6Ly94bmN5d3NhcmppbmxtdXF2ZmZvcC5zdXBhYmFzZS5jbycpLFxuICAgIF9fU1VQQUJBU0VfQU5PTl9LRVlfXzogSlNPTi5zdHJpbmdpZnkoJ2V5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwYzNNaU9pSnpkWEJoWW1GelpTSXNJbkpsWmlJNkluaHVZM2wzYzJGeWFtbHViRzExY1habVptOXdJaXdpY205c1pTSTZJbUZ1YjI0aUxDSnBZWFFpT2pFM056a3dNelF5TURNc0ltVjRjQ0k2TWpBNU5EWXhNREl3TTMwLi1FRjNsLTFPLWVYTGJqWWZDM0c1NlBpX0RpMlpySjE3QVNEUkM5dHNBeEUnKSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgY3J4KHsgbWFuaWZlc3QgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gIH0sXG59KVxuIiwgIntcbiAgXCJtYW5pZmVzdF92ZXJzaW9uXCI6IDMsXG4gIFwibmFtZVwiOiBcIlJleFwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiTmV2ZXIgZm9yZ2V0IGltcG9ydGFudCBlbWFpbHMgYWdhaW4uXCIsXG4gIFwicGVybWlzc2lvbnNcIjogW1wic3RvcmFnZVwiLCBcInRhYnNcIl0sXG4gIFwiaG9zdF9wZXJtaXNzaW9uc1wiOiBbXCJodHRwczovL21haWwuZ29vZ2xlLmNvbS8qXCIsIFwiaHR0cDovL2xvY2FsaG9zdDozMDAxLypcIl0sXG4gIFwiZXh0ZXJuYWxseV9jb25uZWN0YWJsZVwiOiB7XG4gICAgXCJtYXRjaGVzXCI6IFtcbiAgICAgIFwiaHR0cHM6Ly9nZXRyZXguYWkvKlwiLFxuICAgICAgXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKlwiXG4gICAgXVxuICB9LFxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXG4gICAge1xuICAgICAgXCJtYXRjaGVzXCI6IFtcImh0dHBzOi8vbWFpbC5nb29nbGUuY29tLypcIl0sXG4gICAgICBcImpzXCI6IFtcInNyYy9jb250ZW50L2luZGV4LnRzeFwiXSxcbiAgICAgIFwiY3NzXCI6IFtdLFxuICAgICAgXCJydW5fYXRcIjogXCJkb2N1bWVudF9pZGxlXCIsXG4gICAgICBcImFsbF9mcmFtZXNcIjogZmFsc2VcbiAgICB9XG4gIF0sXG4gIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kL3NlcnZpY2Utd29ya2VyLnRzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbiAgfSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wb3B1cC9pbmRleC5odG1sXCIsXG4gICAgXCJkZWZhdWx0X3RpdGxlXCI6IFwiUmV4XCIsXG4gICAgXCJkZWZhdWx0X2ljb25cIjoge1xuICAgICAgXCIxNlwiOiBcImljb25zL2ljb24xNi5wbmdcIixcbiAgICAgIFwiNDhcIjogXCJpY29ucy9pY29uNDgucG5nXCIsXG4gICAgICBcIjEyOFwiOiBcImljb25zL2ljb24xMjgucG5nXCJcbiAgICB9XG4gIH0sXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTZcIjogXCJpY29ucy9pY29uMTYucG5nXCIsXG4gICAgXCI0OFwiOiBcImljb25zL2ljb240OC5wbmdcIixcbiAgICBcIjEyOFwiOiBcImljb25zL2ljb24xMjgucG5nXCJcbiAgfSxcbiAgXCJ3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXNcIjogW1xuICAgIHtcbiAgICAgIFwicmVzb3VyY2VzXCI6IFtcImljb25zLypcIl0sXG4gICAgICBcIm1hdGNoZXNcIjogW1wiaHR0cHM6Ly9tYWlsLmdvb2dsZS5jb20vKlwiXVxuICAgIH1cbiAgXVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFvQjtBQUN0VixPQUFPLFdBQVc7QUFDbEIsU0FBUyxXQUFXOzs7QUNGcEI7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLGFBQWUsQ0FBQyxXQUFXLE1BQU07QUFBQSxFQUNqQyxrQkFBb0IsQ0FBQyw2QkFBNkIseUJBQXlCO0FBQUEsRUFDM0Usd0JBQTBCO0FBQUEsSUFDeEIsU0FBVztBQUFBLE1BQ1Q7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxTQUFXLENBQUMsMkJBQTJCO0FBQUEsTUFDdkMsSUFBTSxDQUFDLHVCQUF1QjtBQUFBLE1BQzlCLEtBQU8sQ0FBQztBQUFBLE1BQ1IsUUFBVTtBQUFBLE1BQ1YsWUFBYztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osZ0JBQWtCO0FBQUEsSUFDbEIsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFFBQVU7QUFBQSxJQUNSLGVBQWlCO0FBQUEsSUFDakIsZUFBaUI7QUFBQSxJQUNqQixjQUFnQjtBQUFBLE1BQ2QsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsMEJBQTRCO0FBQUEsSUFDMUI7QUFBQSxNQUNFLFdBQWEsQ0FBQyxTQUFTO0FBQUEsTUFDdkIsU0FBVyxDQUFDLDJCQUEyQjtBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQUNGOzs7QUR6Q0EsSUFBTSxTQUFTLFFBQVEsSUFBSSxhQUFhO0FBQ3hDLElBQU0sZUFBZSxRQUFRLElBQUksZUFBZSxVQUFVLENBQUM7QUFFM0QsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sZ0JBQWdCLEtBQUs7QUFBQSxNQUNuQixlQUFlLDBCQUEwQjtBQUFBLElBQzNDO0FBQUEsSUFDQSxpQkFBaUIsS0FBSztBQUFBLE1BQ3BCLGVBQWUsMEJBQTBCO0FBQUEsSUFDM0M7QUFBQSxJQUNBLGtCQUFrQixLQUFLLFVBQVUsMENBQTBDO0FBQUEsSUFDM0UsdUJBQXVCLEtBQUssVUFBVSxrTkFBa047QUFBQSxFQUMxUDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSSxFQUFFLDJCQUFTLENBQUM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
