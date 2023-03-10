// styles:
import "./Create.css";

import Select from "react-select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";

// for Select field:
const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  const navigate = useNavigate();
  const {
    addDocument,
    convertToTimeStamp,
    createTimeStampCurrentTime,
    response,
  } = useFirestore("projects");
  const { user } = useAuthContext();
  const { documents: usersDocs } = useCollection("users");

  const [assignableUsers, setAssignableUsers] = useState([]);

  // form field values:
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (usersDocs) {
      const options = usersDocs.map((user) => {
        return { value: user, label: user.displayName };
      });
      setAssignableUsers(options);
    }
  }, [usersDocs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!category) {
      setFormError("Please select a project category.");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least one user.");
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });
    const dateDue = await convertToTimeStamp(new Date(dueDate));
    const currentTime = await createTimeStampCurrentTime();

    const project = {
      name: name,
      details: details,
      category: category,
      dueDate: dateDue,
      comments: [],
      createdBy: createdBy,
      createdAt: currentTime,
      assignedUsersList: assignedUsersList,
    };
    addDocument(project);
    if (!response.error) {
      navigate("/");
    } else {
      setFormError(response.error);
    }
  };

  return (
    <div className="create-form">
      <h2 className="page-title">Create a New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project Name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            required
            type="text"
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Set Due Date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project Category:</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option.value)}
          />
        </label>
        <label>
          <span>Assign To:</span>
          <Select
            options={assignableUsers}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>
        {!response.isPending && <button className="btn">Add Project</button>}
        {response.isPending && (
          <button className="btn" disabled>
            Adding...
          </button>
        )}
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
