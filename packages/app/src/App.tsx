import React from 'react';
import { Route } from 'react-router-dom';
import { apiDocsPlugin } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import { catalogImportPlugin } from '@backstage/plugin-catalog-import';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { techdocsPlugin } from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import {
  ApplicationListPage,
  EnvironmentListPage,
  ResourceListPage,
  ResourcePage,
  radiusPlugin,
} from '@internal/plugin-radius';
import {
  UnifiedThemeProvider,
  createBaseThemeOptions,
  createUnifiedTheme,
  genPageTheme,
  palettes,
  shapes,
} from '@backstage/theme';
import { HomePage } from './components/home/HomePage';

const lightTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.light,
      primary: {
        main: '#db4c24',
      },
    },
  }),
  defaultPageTheme: 'other',
  pageTheme: {
    other: genPageTheme({ colors: ['#db4c24', '#db4c24'], shape: shapes.wave }),
  },
});

const darkTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    // https://m2.material.io/inline-tools/color/
    palette: {
      ...palettes.dark,
      primary: {
        main: '#db4c24',
      },
    },
  }),
  defaultPageTheme: 'other',
  pageTheme: {
    other: genPageTheme({ colors: ['#db4c24', '#db4c24'], shape: shapes.wave }),
  },
});

const app = createApp({
  apis,
  themes: [
    {
      id: 'light',
      title: 'Light',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={lightTheme} children={children} />
      ),
    },
    {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={darkTheme} children={children} />
      ),
    },
  ],
  bindRoutes({ bind }) {
    bind(radiusPlugin.externalRoutes, {});
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/applications" element={<ApplicationListPage />} />
    <Route path="/environments" element={<EnvironmentListPage />} />
    <Route path="/resources" element={<ResourceListPage />} />
    <Route
      path="/resources/:group/:namespace/:type/:name"
      element={<ResourcePage />}
    />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
