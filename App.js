import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { MaterialIcons } from "@expo/vector-icons";



export default function App() {
  const[messages, setMessages] = useState([])                 //initial messages state empty


  const[inputMessage, setInputMessage] = useState("")         //method=setInputMessage, initvalue using useState
  const[outputMessage, setOutputMessage] = useState("Results shown here")


  //for 3.5turbo


  const handleButtonClick=()=>{                               //function that takes the messages when pressed send
    console.log(inputMessage)
    const message = {
      _id : Math.random().toString(36).substring(7),                //converts random number to base 36
      text : inputMessage,
      createdAt : new Date(),                                       //assigns current date and time to message
      user : {_id:1}                                                //{} is for object
    }
    setMessages((previousMessages)=>
      GiftedChat.append(previousMessages, [message])
    )

    fetch("https://api.openai.com/v1/chat/completions",{           //when user presses send, this fetches apichatcompletion and 
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer $OPENAI_API_KEY"
      },
      body:JSON.stringify({
        "messages": [{ "role": "user","content": inputMessage}],        //this becomes the prompt for the completion api
        "model": "gpt-3.5-turbo", 
      })

    }).then((response)=>response.json()).then((data)=>{                   //convert response to json then access it 
        console.log(data.choices[0].message.content)                      //0th index is output message content
        setOutputMessage(data.choices[0].message.content.trim())          //data becomes output message content
        const message = {
          _id : Math.random().toString(36).substring(7),                
          text : data.choices[0].message.content.trim(),
          createdAt : new Date(),                                  
          user : {_id:2, name:"Bot"},                                               
        }
        setMessages((previousMessages)=>
          GiftedChat.append(previousMessages, [message])
        )
    })              
  }

  //FOR DALL-E

  const generateImages=()=>{                              
    console.log(inputMessage)
    const message = {
      _id : Math.random().toString(36).substring(7),             
      text : inputMessage,
      createdAt : new Date(),                                     
      user : {_id:1}                                               
    }
    setMessages((previousMessages)=>
      GiftedChat.append(previousMessages, [message])
    )

    fetch("https://api.openai.com/v1/images/generations",{         
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer $OPENAI_API_KEY"
      },
      body:JSON.stringify({
        "model": "dall-e-3",
        "prompt": inputMessage,
        "n" : 2,
        "size" : "512x512",
      })

    }).then((response)=>response.json()).then((data)=>{                
        console.log(data.data[0].url)                      
        setOutputMessage(data.data[0].url)
        const message = {
          _id : Math.random().toString(36).substring(7),                
          text : "Image",
          createdAt : new Date(),                                  
          user : {_id:2, name: "Your Bot"}, 
          image : data.data[0].url                                              
        }
        setMessages((previousMessages)=>
          GiftedChat.append(previousMessages, [message])
        )        
    })              
  }



  const handleTextInput=(text)=>{    //function that takes text (string) from textinput
    setInputMessage(text)
    console.log(text)
  }

  return (
    <View style={{flex:1}}>
      <View style={{flex:1, justifyContent:'center' }}>
        <Text>{outputMessage}</Text> 
        <GiftedChat messages={messages} renderInputToolbar={()=>{ }} user={{_id:1}} minInputToolbarHeight={0} /*remove gifted chat bar and make invisible height to 0*/ /> 
      </View> 
      
      <View style={{flexDirection: "row"}}>
      
        <View style={{flex:1, marginLeft:10, marginBottom:20, backgroundColor:"white", borderRadius:10, 
                      borderColor:"grey", borderWidth:1, height:60, marginLeft:10, marginRight:10, justifyContent:"center",
                      paddingLeft:10, paddingRight: 10}}>
          <TextInput placeholder='Ask the chatbot anything you would like?!' onChangeText={handleTextInput}/> 
        </View>

        <TouchableOpacity onPress={handleButtonClick}>
          <View style={{backgroundColor: '#6600FF', padding:5, marginRight:10, marginBottom:20, 
                        borderRadius:9999, width:60, height:60, justifyContent:"center", }}>
            <MaterialIcons name="send" size={30} color="white" style = {{ marginLeft:10 }}/>
          </View>  
        </TouchableOpacity>

      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#990033',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
