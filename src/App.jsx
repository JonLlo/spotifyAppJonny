import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "fe7fbeb86abe48dd8fd721c5d05f5551"
const CLIENT_SECRET = "eeba6fa8e1b34b6b83300f849abb5b70"


function App() {
  const [ searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [ albums, setAlbums ] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    //API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, []) 

  //Search

  async function search() {
    if (!searchInput) {
      setErrorMessage("Search input is empty.");
      setAlbums([]);
      console.log("Search input is empty.");
      // Optionally, you can display a message to the user indicating that the search box is empty
      return;
    }
    console.log("Searching for " + searchInput) 



       //Get request using search to get the Artist ID
       var searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + accessToken

        }


       }

       var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
       .then(response => response.json())
       .then(data => {
         if (data.artists.items.length === 0) {
          setErrorMessage("No artists found for the given search query.");
          setAlbums([]);
           console.log("No artists found for the given search query.");
           return "no";
         } else {
           console.log(data);
           return data.artists.items[0].id;
         }
       });
 
     // If artistID is null, no need to proceed with fetching albums
     if (artistID === "no") {
       return ("WRONG ENTRY");
     }
        


       //Get request using artist ID to grab all the albums from that artist
       var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {
          setErrorMessage("");


          console.log(data);
          setAlbums(data.items);
        });
       


       //Display those albums to user/
  }
  console.log('albums are as follows:')
  console.log(albums)
   

  return (
    <div>
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist!!!"
            type="input"
            onKeyPress={event=> {
              if (event.key == "Enter") {
                search();

              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
          <Container>{errorMessage && <p>{errorMessage}</p>}</Container>
        </InputGroup>
      </Container>
      <Container>
          <Row>
          {albums.map((album, i) => {
            return (
            <Card className="card col-lg-3 col-md-4 col-sm-6 col-12">
            <Card.Img src= {album.images[0].url}/>
            <Card.Body>
              <Card.Title className="artist">{album.artists[0].name}</Card.Title>
              <Card.Title className="album">{album.name}</Card.Title>
            </Card.Body>
          </Card>
            )}) }
          </Row>
      </Container>


    </div>
  );
}

export default App;
