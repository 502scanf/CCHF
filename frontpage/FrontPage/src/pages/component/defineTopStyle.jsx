import './component.scss'

function DefineTopStyle({topName, backgroundPhoto}){
  return (
    <div className={"topStyle"}>
      <img src={backgroundPhoto} alt={backgroundPhoto}/>
      <span>{topName}</span>
    </div>
  )
}

export default DefineTopStyle
