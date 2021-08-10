import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                    name="description"
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://huy:oOZ1lvcBt49zkUMP@cluster0.fgnj6.mongodb.net/meetups?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetupsId = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: false, //false will support only meetupId list in paths, true will try to fetch all meetupId
        paths: meetupsId.map((item) => ({
            params: {
                meetupId: item._id.toString(),
            },
        })),
    };
}

export async function getStaticProps(context) {
    const client = await MongoClient.connect(
        'mongodb+srv://huy:oOZ1lvcBt49zkUMP@cluster0.fgnj6.mongodb.net/meetups?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    //fetch data for a single meetup
    const meetupId = context.params.meetupId;

    const meetupData = await meetupsCollection.findOne({
        _id: ObjectId(meetupId),
    });

    return {
        props: {
            meetupData: {
                ...meetupData,
                _id: meetupData._id.toString(),
            },
        },
    };
}

export default MeetupDetails;
