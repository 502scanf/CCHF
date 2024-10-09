import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'
import loadingPhoto from '../../lib/pageSource/loading2.svg'
import logo from '../../lib/pageSource/logo.png'
export default function Index() {

  useLoad(() => {
    console.log('Page loaded')
    setTimeout(()=>{
      Taro.navigateTo({
        url: '/pages/home/home'
      }).then(() => {
        console.log('Navigation success')
      }).catch(err => {
        console.error('Navigation failed:', err)
      })
    },2000)

  })

  return (
    <div className={"loading"}>
      <div className={"loadingLogo"}>
        <img src={loadingPhoto} alt={loadingPhoto}/>
        <img className={"logo"} src={logo} alt={logo}/>
      </div>
    </div>
  )
}
