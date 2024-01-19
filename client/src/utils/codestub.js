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

