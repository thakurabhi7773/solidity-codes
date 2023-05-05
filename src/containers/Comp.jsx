
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';

const createPostCss = {
    backgroundColor: '',
    marginTop: '0px'
}
const Comp = ({contract, accountsAddress}) => {
    const [posts, setPosts] = useState([]);
    const [metadataResult, setMetadataResult] = useState([]);
    const [createIsTrue, setCreateIsTrue] = useState(false);
    const [image , setImage] = useState(null);
    const [postContent, setPostContent] = useState();
    const [postCount, setPostCount] = useState(1);
    const [isUploading, setUploading] = useState(false)

    const handleSetImage = (event) => {
        setImage(event.target.files[0]);
          // console.log(image)
      }
  
    const handleSetMetadata = (event) => {
          setPostContent(event.target.value)
          // console.log(postContent)
      }

    const createPostHandel = () => {
        // console.log("hello")
        setCreateIsTrue(true);
    }

    useEffect(() => {
        loadContract();
        // fetchAllData()
      },[posts]);

      useEffect(() => {
        // loadContract();
        fetchAllData()
      },[posts]);

      const loadContract = async () => {
        if (contract) {
          const allPosts = await contract.methods.getAllPosts().call();
          setPosts(allPosts);

        //   console.log("postsssss....",allPosts)
  
          // Start listening for real-time updates
          contract.events.PostCreated()
            .on('data', handlePostCreated);
        }
      };

      const fetchMetadata = async (cid) => {
        try {
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
          if (!response.ok) {
            throw new Error(`Error fetching metadata for CID: ${cid}`);
          }
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const metadata = await response.json();
            return metadata;
          } else {
            throw new Error(`Invalid response format for CID: ${cid}`);
          }
        } catch (error) {
          console.error(`Error fetching metadata for CID: ${cid}`, error);
          return null;
        }
      };

      // const fetchMetadata = async (cid) => {
      //   try {
      //       const res = await fetch(``)
      //   }catch{

      //   }
      // };

      const fetchAllData = async () => {
        const IpfsData = posts.map( data => data.ipfsHash)
        // console.log(IpfsData)
        const mapping = await Promise.all(IpfsData)
        // console.log("mapping is ",mapping);
        const promissIpfs = await mapping.map(cid => fetchMetadata(cid))
        // console.log(promissIpfs)
        const p = await Promise.all(promissIpfs)
        // console.log(p)
        setMetadataResult(p)
      }

      const handlePostCreated = (event) => {
        // console.log("from post created handle")
        // Handle the new post created event
        const newPost = {
          id: event.returnValues.postId,
          ipfsHash: event.returnValues.ipfsHash,
          author: event.returnValues.author,
          timestamp: event.returnValues.timestamp,
        };
        // console.log("new post ",newPost)
    
        // Update the posts array with the new post
        setPosts((prevPosts) => [...prevPosts, newPost]);
      };

      const uploadPostImage = async () => {
        try {
          const imageFormData = new FormData();
          imageFormData.append('file', image);
    
          const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjg4MjhjNS1lZjkyLTRiZWYtOGRlMC1lYTc0MGMwODAwYzAiLCJlbWFpbCI6InJ1cGFtaGFyb2QxMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2UzMTIwNzBlNzczZGY4ZjQxZGMiLCJzY29wZWRLZXlTZWNyZXQiOiI1MmNjY2Q1ODRmMDg2NTNhMjRlOGY2OWI1YWRiYTNiZDAxNzg2ZWE0ZjMxMTUxZTk5NDc0MzY4ZWZmZWNmM2U4IiwiaWF0IjoxNjgzMjY3MjY3fQ.mg2kz91WdTSTyQ4xB8uR-d7kwzv5etGrQRB77jcdiEE',
            },
            body: imageFormData,
          });
    
          const imageData = await imageResponse.json();
          const imageCID = imageData.IpfsHash
          // console.log(imageCID)
          return imageCID
    
          // Here you can handle the response, such as displaying the NFT URL or token ID
        } catch (error) {
          console.error("image error ...........",error);
        }
      };
    
      const uploadPostMetadata = async () => {
        const imageHash = await uploadPostImage()
        try {
          const data = {
            postCount: `POST ${postCount}`,
            imageHash: `https://ipfs.io/ipfs/${imageHash}`,
            content: postContent
          }
          const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjg4MjhjNS1lZjkyLTRiZWYtOGRlMC1lYTc0MGMwODAwYzAiLCJlbWFpbCI6InJ1cGFtaGFyb2QxMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2UzMTIwNzBlNzczZGY4ZjQxZGMiLCJzY29wZWRLZXlTZWNyZXQiOiI1MmNjY2Q1ODRmMDg2NTNhMjRlOGY2OWI1YWRiYTNiZDAxNzg2ZWE0ZjMxMTUxZTk5NDc0MzY4ZWZmZWNmM2U4IiwiaWF0IjoxNjgzMjY3MjY3fQ.mg2kz91WdTSTyQ4xB8uR-d7kwzv5etGrQRB77jcdiEE',
            },
            body: JSON.stringify(data),
          });

          const metadataData = await response.json();
          // console.log(metadataData.IpfsHash)
          return metadataData.IpfsHash;
        } catch (error) {
          console.error("metadata error ...........",error);
        }
      };


      const createPost = async () => {
        setUploading(true)
        // console.log("hello")
        const ipfsHash  = await uploadPostMetadata()
        // console.log("ipfshashhh........",ipfsHash);
        if (contract) {
            try {
                await contract.methods.createPost(ipfsHash).send({ from: accountsAddress });
                setPostCount(postCount + 1)
            } catch (error) {
                console.error('Error uploading NFT:', error);
            }
            
        } else {
            console("cant find contract please set contractABI and contractAddress ")
        }
        setCreateIsTrue(false);
        setUploading(false)
      };

      console.log("jnxwbjhcvwu...............................",metadataResult)
  return (
    <div>
        <Grid style={createPostCss}>
            {!createIsTrue ?
            <button onClick={createPostHandel}>Create Post</button>
            :
            <Grid>
                <input type="file" onChange={handleSetImage}/>
                <Typography>Write discription</Typography>
                <input type='text' onChange={handleSetMetadata}/>
                {!isUploading ?
                <button onClick={createPost}>Upload</button>:
                <p>uploading...</p>
                }
            </Grid>
            }
        </Grid>
        <Grid margin={'10px'} container spacing={3}>
        {metadataResult &&
          metadataResult.length > 0 &&
          metadataResult.map((data) => (
            <Grid item xs={3}>
              {data && data.postCount ? (
                <Typography fontSize={'13px'}>{data.postCount}</Typography>
              ) : null}
              <CardMedia component="img" alt="Plan" height="200" image={data?.imageHash} />
              <CardContent>
                <Typography fontSize={'12px'} variant="body1">{data?.content}</Typography>
              </CardContent>
            </Grid>
          ))}
      </Grid>
    </div>
  )
}

export default Comp
