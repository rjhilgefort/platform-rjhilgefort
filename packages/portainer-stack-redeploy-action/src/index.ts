import actionsCore from '@actions/core'
import { portainerStackRedeploy } from '@repo/portainer-stack-redeploy'

portainerStackRedeploy({
  host: actionsCore.getInput('host'),
  accessToken: actionsCore.getInput('accessToken'),
  stackName: actionsCore.getInput('stackName'),
})
  .then(() => {
    actionsCore.setOutput('success', true)
  })
  .catch((error) => {
    actionsCore.setFailed(error.message)
  })
