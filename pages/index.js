import { MongoClient } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';
import MeetupList from '../components/meetups/MeetupList';

// const DUMMY_MEETUPS = [
//     {
//         id: 'm1',
//         title: 'A First Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//         address: 'Some address 5, 12345 Some City',
//         description: 'This is a first meetup!',
//     },
//     {
//         id: 'm2',
//         title: 'A Second Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//         address: 'Some address 10, 12345 Some City',
//         description: 'This is a second meetup!',
//     },
// ];

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="List of meetups" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     //fetch data from an API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         },
//     };
// }

export async function getStaticProps() {
    // fetch data from an API

    const client = await MongoClient.connect(process.env.MONGODB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();

    console.log(meetups);

    return {
        props: {
            meetups: meetups.map((meetup) => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            })),
        },
        revalidate: 10, //regenerate the page each 10 second (when deployed)
    };
}

export default HomePage;
