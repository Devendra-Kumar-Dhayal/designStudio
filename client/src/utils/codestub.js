export const  codeJavaScript = `
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'your-app',
  brokers: ['your-kafka-broker:9092'],
});

const producer = kafka.producer();

async function sendMessage(topic, message) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
}

// Example usage
sendMessage('your-topic', { key: 'value' });
`;

export const codePython = `
from confluent_kafka import Producer

def delivery_report(err, msg):
    if err is not None:
        print('Message delivery failed: {}'.format(err))
    else:
        print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()))

def send_message(bootstrap_servers, topic, message):
    producer_config = {
        'bootstrap.servers': bootstrap_servers,
    }

    producer = Producer(producer_config)

    producer.produce(topic, value=message, callback=delivery_report)

    producer.flush()

if __name__ == '__main__':
    kafka_bootstrap_servers = 'your-kafka-broker:9092'
    kafka_topic = 'your-topic'
    message_to_send = {'key': 'value'}

    send_message(kafka_bootstrap_servers, kafka_topic, message_to_send)
`;


export const codeJava = `
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.util.Properties;

public class Producer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put("bootstrap.servers", "your-kafka-broker:9092");
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");

        KafkaProducer<String, byte[]> producer = new KafkaProducer<>(props);

        String topic = "your-topic";
        String key = "key";
        byte[] value = "value".getBytes();

        ProducerRecord<String, byte[]> record = new ProducerRecord<>(topic, key, value);

        producer.send(record);

        producer.close();
    }
}
`;

export const codeGo = `
package main

import (
  "context"
  "fmt"

  "github.com/segmentio/kafka-go"
)

func main() {
  topic := "your-topic"
  partition := 0

  conn, err := kafka.DialLeader(context.Background(), "tcp", "your-kafka-broker:9092", topic, partition)
  if err != nil {
    panic(err)
  }
  defer conn.Close()

  conn.SetWriteDeadline(time.Now().Add(10*time.Second))
  _, err = conn.WriteMessages(
    kafka.Message{Value: []byte("value")},
  )
  if err != nil {
    panic(err)
  }

  fmt.Println("Message sent!")
}
`;

export const codeReact = `
import React from 'react';

import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'your-app',
  brokers: ['your-kafka-broker:9092'],
});

const producer = kafka.producer();

const sendMessage = async (topic, message) => {

  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
}

const App = () => {
  const [message, setMessage] = React.useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleClick = () => {
    sendMessage('your-topic', { key: message });
  };

  return (
    <div>
      <input type="text" value={message} onChange={handleChange} />
      <button onClick={handleClick}>Send</button>
    </div>
  );
};

export default App;
`;


export const codeNode = `
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  // Handle the incoming message from Boomi
  const message = req.body;
  console.log('Received message:', message);

  // Your processing logic here

  res.status(200).send('Message received successfully');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});
`;


export const codeFlask = ` 
from flask import Flask, request
app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    # Handle the incoming message from Boomi
    message = request.json
    print('Received message:', message)

    # Your processing logic here

    return 'Message received successfully', 200

if __name__ == '__main__':
    app.run(port=5000)
`;

export const codeSpring = `
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}

@RestController
class WebhookController {

    @PostMapping("/webhook")
    public String webhook(@RequestBody Map<String, Object> message) {
        // Handle the incoming message from Boomi
        System.out.println("Received message: " + message);

        // Your processing logic here

        return "Message received successfully";
    }
}

`;



export const codeGoHandler = `
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default()

    r.POST("/webhook", func(c *gin.Context) {
        // Handle the incoming message from Boomi
        var message map[string]interface{}
        if err := c.BindJSON(&message); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        // Your processing logic here

        c.String(http.StatusOK, "Message received successfully")
    })

    r.Run(":8080")
}
`

