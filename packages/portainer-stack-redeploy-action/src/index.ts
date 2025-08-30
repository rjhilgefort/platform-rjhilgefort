import actionsCore from '@actions/core'
import portainerStackRedeploy from '@repo/portainer-stack-redeploy'

const host = actionsCore.getInput('host')
const accessToken = actionsCore.getInput('accessToken')
const stackName = actionsCore.getInput('stackName')

portainerStackRedeploy
  .portainerStackRedeploy({
    host,
    accessToken,
    stackName,
  })
  .then(() => {
    actionsCore.setOutput('success', true)
  })
  .catch((error) => {
    actionsCore.setFailed(error.message)
  })
