//our-domain.com/new-meetup

import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function NewMeetup() {
    const router = useRouter();

    async function addMeetupHandler(enteredMeetupData) {
        const response = await fetch('/api/new-meetup', {
            method: 'POST',
            body: JSON.stringify(enteredMeetupData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Fetch failed!');
        }

        const data = await response.json();

        console.log(data);

        router.push('/');
    }

    return (
        <Fragment>
            <Head>
                <title>Add new Meetup</title>
                <meta
                    name="description"
                    content="Add new Meetup to the list of meetups"
                />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </Fragment>
    );
}

export default NewMeetup;
