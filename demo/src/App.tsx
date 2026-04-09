// @ts-nocheck
import { SearchForm } from '@test111190909222/components'
import './App.css'

function App() {
  return (
    <>
      <SearchForm fields={[
        {
          label: 'Name',
          name: 'name',
          type: 'input',
        },
        {
          label: 'Age',
          name: 'age',
          type: 'input',
        },
      ]} onSearch={() => {}} />
      ddddd
    </>
  )
}

export default App
