# Live Demo

https://documents-system-challenge.vercel.app/

<br>


## Approach

The goal was to keep the application simple while making it resemble a real-world case as closely as possible. I have divided the components into business-specific components and pure UI components (so far, there's only one). However, this division would allow, in the future, the inclusion of components related to a design system within the mentioned UI folder. Additionally, I have defined folders for services, domain, and hooks. Naturally, if the app were larger and there were more time, the functionalities would be divided into modules, with each module containing its own domain definition, mappers, components, services, and repositories if needed.


<br>


## Data fetching and database

To simulate the logic, I created a very basic database in Supabase to persist the information. This is viable in the context of this test, but for a production case, interacting directly with the database would not be a good idea. Instead, the backend would handle this task.
To fetch notifications about state changes, I’m using polling with Supabase. In a real-world scenario, the best solution would be to use a WebSocket server to keep this information up to date.


<br>

## Mailing service

To simulate the functionality as closely as possible, I am using the EmailJS library for sending emails from the client. My email address is configured for this purpose, so if you run tests, you will receive an email from my account (this is a free trial with a limit of 200 emails per month). Attachments are not supported, which is why you will not find any attached files in the email.

The email you receive will contain two buttons. These buttons send a request to an Edge Function I created in Supabase to update the document's status to either "Signed" or "Declined." For practical reasons, the email is sent only to the first assigned person, and clicking the button updates the document's status regardless of whether it has one or more signatories.


<br>

## Styles

To maintain simplicity, I’m using Chakra UI, which provides pre-built components and an easy-to-use API for styling.

<br>


## Testing

I added some test using vitest and react-testing library. But I did not have enough time to test all the components and services. You can check the test running:

<br>

```
  npm install
  npx vitest
  npm run coverage
```