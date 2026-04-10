// @ts-nocheck
// import { SearchForm } from '@test111190909222/components'
import './App.css'
import { SearchForm,Button } from '@sh-ai/work-ui'

function App() {
  return (
    <>
      <Button type='primary'>123</Button>
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
