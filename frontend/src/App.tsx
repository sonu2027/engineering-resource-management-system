import Route from './Route'
import { SocketProvider } from './customHooks/SocketProvider'

function App() {
  return (
    <SocketProvider>
      <Route />
    </SocketProvider>
  )
}

export default App