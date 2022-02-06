import './App.css';
import {useState, useEffect} from 'react'
import { Grid } from '@mui/material';
import { Dropzone, FileItem } from "@dropzone-ui/react";
import axios from 'axios';
import Loader from './loader'

const Profile = ({img,index})=>{
  
  return <>
  <img src={img} alt="John" style={{width:'100%'}} />
        <p className="title">Product {index+1}</p>
        <div style={{margin: '24px 0;'}}>
          <a href="#"><i className="fa fa-heart"></i></a> 
          <a href="#"><i className="fa fa-shopping-cart"></i></a>  
          <a href="#"><i className="fa fa-pencil"></i></a>  
        </div>
  </>
}

function App() {
  const [suggestions,setSuggestions] = useState([])
  const [files, setFiles] = useState('');
  const [preview, setPreview] = useState([]);
  const [loader,setLoader] = useState(true)

  const callApi = ()=>{
    setLoader(true)
    const body = {
      item: files
    }
    axios.post('http://f336-35-221-199-73.ngrok.io/temp',body).then(res=>{
      setLoader(false)
      setSuggestions(res.data)
    })
  }

  useEffect(()=>{
    setTimeout(() => {
      setLoader(false)
    }, 3000);
  },[])


  const updateFiles = (incommingFiles) => {
    setFiles('')
    setPreview([])
    const index = incommingFiles.length - 1
    let reader = new FileReader();
    reader.readAsDataURL(incommingFiles[index].file);
    reader.onload = function () {
      
        setFiles(reader.result.split('data:image/jpeg;base64,')[1])
        setPreview([incommingFiles[incommingFiles.length - 1]])
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
    
  };


  
  const imageFormatter = (image)=>{
    const filePrefix = 'data:image/jpeg;base64,'
    return filePrefix+image.split("b'")[1].split("'")[0]
  }

  console.log(preview,'===preview');

  return (
    <Grid container justifyContent={'center'}>
      {
        loader &&  <Loader />
      }
     
      <Grid container xs={6}>
        <Grid item md={12}>
        <Dropzone onChange={updateFiles}  accept='image/jpeg' value={preview}>
          {preview.map((file) => (
            <FileItem {...file} preview />
          ))}
        </Dropzone>
        <p><button onClick={callApi}>Find</button></p>
        </Grid>
        <Grid item md={12}>
          <h1>Find Similar products</h1>
          <hr></hr>
        </Grid>
        <Grid item container md={12}  spacing={2}>
          {
            suggestions.map((sug,index)=>(
              <Grid item md={3}>
                <Profile index={index} img={imageFormatter(sug)}/>
                {/* <img src={imageFormatter(sug)}/> */}
              </Grid>
            ))
          }
          {/* <Grid item md={3}>
            <Profile />
          </Grid> */}
          {/* <Grid item md={3}>
            <Profile />
          </Grid>
          <Grid item md={3}>
            <Profile />
          </Grid>
          <Grid item md={3}>
            <Profile />
          </Grid>
          <Grid item md={3}>
            <Profile />
          </Grid>
          <Grid item md={3}>
            <Profile />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
