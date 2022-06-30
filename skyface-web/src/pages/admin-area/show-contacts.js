import React from "react";
import { SkyCloudLoader } from "../../components/Loader";
import apiService from "../../services/api-service";

export default function ShowContacts() {
  const [contacts, setContacts] = React.useState([]);
  const [contactsCount, setContactsCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    apiService("admin/contact/show").then((res) => {
      setContacts(res.data.openContacts);
      setContactsCount(res.data.openContactsCount);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <SkyCloudLoader />;

  return (
    <div className="container">
      <h1>{contactsCount} </h1>
      <table
        className="table table-striped"
        style={{ border: "1px solid #ccc", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.subject}</td>
              <td>{contact.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
