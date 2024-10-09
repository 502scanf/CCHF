import { useLoad } from '@tarojs/taro'
import './index.scss'
import loadingPhoto from '../../lib/pageSource/loading.svg'
export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <div className={"loading"}>
      <img src={loadingPhoto} alt={loadingPhoto}/>
    </div>
  )
}
