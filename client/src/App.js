import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	IconButton,
	Input,
	Text,
} from '@chakra-ui/react'
import {FaTimes, FaLocationArrow } from 'react-icons/fa'
import {useJsApiLoader, 
	GoogleMap, 
	Marker, 
	Autocomplete,
	DirectionsRenderer,
} from  '@react-google-maps/api'
import { useState, useRef } from 'react' 


const center ={ lat: 9.0820, lng: 8.6753}
function App() {

const {isLoaded} = useJsApiLoader({
	googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
	libraries: ['places'],
})

const [map, setMap] = useState( /** @type google.maps.Map*/ (null))
const [directionsResponse, setDirectionsResponse] = useState(null)
const [distance, setDistance] = useState('')
const [duration, setDuration] = useState('')
const [token, setToken] = useState('')
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')

	/** @type React.MutableRefObject<HTMLInputElement> */
const userLocationRef = useRef()

	/** @type React.MutableRefObject<HTMLInputElement> */
const locationRef = useRef()


if(!isLoaded){
return <Flex justifyContent="center" alignItems="center" height="100vh">Loading...</Flex>;
}

async function calculateRoute(){
	if(userLocationRef.current.value ==='' || locationRef.current.value === ''){
		return
	}
	// eslint-disable-next-line no-undef
	const directionsService = new google.maps.DirectionsService()
	const results = await directionsService.route({
		origin: userLocationRef.current.value,
		destination: locationRef.current.value,
			// eslint-disable-next-line no-undef
		travelMode: google.maps.TravelMode.DRIVING
	})
	setDirectionsResponse(results)
	setDistance(results.routes[0].legs[0].distance.text)
	setDuration(results.routes[0].legs[0].duration.text)
}

function clearRoute(){
	setDirectionsResponse(null)
	setDistance('')
	setDuration('')
	userLocationRef.current.value = ''
	locationRef.current.value = ''
}
const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
	  console.log(data);
      
    } catch (error) {
      setError('Sign up failed')
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
	  console.log(data)

	  if(response.ok){
		setToken(data.token)
		setError('')
	  }else{
		setError(data.message)
	  }
     
    } catch (error) {
      setError('Login failed')
    }
  }

	return (
		<Flex
			position='relative'
			flexDirection='column'
			alignitems = 'center'
			bgcolor= 'blue'
			h = '100vh'
			w = '100vw'

		>
		 
			<Box position = 'absolute' left = {0} top={2} h ='100%' w ='100%'>
				{/* Google Map box*/ }
				<GoogleMap 
				center ={center} 
				zoom ={15} 
				mapContainerStyle={{width: '100%', height : '100%'}}
				options={{
					streetViewControlOptions: true,
					mapTypeControlOptions: true,
					fullscreenControlOptions: true
				}}
				onLoad={(map)=>setMap(map)}
				>
					<Marker position={center}/>
					 {directionsResponse && <DirectionsRenderer directions={directionsResponse}/> }
				</GoogleMap>
			</Box>
		<Flex
		justifyContent='center'
		alignItems='flex-start'
		minHeight="100vh"  
		>
		<Box
			p = {4}
			borderRadius='12'
			m ={4}
			bgColor='white'
			shadow = 'base'
			minw= 'container.md'
			zIndex='1'
			>
				<HStack spacing ={4}>
					<Autocomplete>
						<Input type='text' placeholder='Your location' ref= {userLocationRef}/>
					</Autocomplete>
				
				<Autocomplete>
					<Input type='text' placeholder='Search Location' ref ={locationRef}/>
				
				</Autocomplete>

					<ButtonGroup>
							<Button
							border='none'
							padding = '4px 12px'
							borderRadius= {100}
							color = 'white'
							 background = ' blue' 
							 type ='submit' 
							 onClick={calculateRoute}>
								Calculate Route
							</Button>
							<IconButton 
							isRound
							aria-label='center back'
							icon = {<FaTimes/>}
							onClick ={clearRoute}
							/>
					</ButtonGroup>

				</HStack>
				<HStack spacing ={4} mt={4} justifyContent='space-between'>
						<Text>Distance: {distance} </Text>
						<Text>Duration: {duration}</Text>
						<IconButton
						isRound 
						aria-label='center back'
						icon = {<FaLocationArrow/>}
						borderRadius= 'full'
						onClick={()=> {
							map.panTo(center)
							map.setZoom(15)
						}}
						/>
				</HStack>
			
		</Box>
		</Flex>
	<Flex
  justifyContent='center'
  alignItems='center' 
  height='100vh' 
>
  <Flex flexDirection='column' alignItems='center'>
    <Input type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
    <Input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
    <Button onClick={handleSignUp}>Sign Up</Button>
    <Button onClick={handleLogin}>Login</Button>
    {error && <Text color='red'>{error}</Text>}
  </Flex>
</Flex>
		
</Flex>
	 
	);
}

export default App;
