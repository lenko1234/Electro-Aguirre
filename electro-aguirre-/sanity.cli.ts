import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'gbe69kxi',
    dataset: 'production'
  },
  deployment: {
    appId: 'zl4x7u81dnu7ut25104g1y4p',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
