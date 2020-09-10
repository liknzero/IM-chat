import Vconsole from 'vconsole'
let vConsole = new Vconsole()
if (process.env.NODE_ENV !== 'development') {
    vConsole = {}
}
export default vConsole