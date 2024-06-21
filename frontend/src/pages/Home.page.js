import '../static/Home.Page.css'; 
import React, { useState, useEffect } from 'react';
import { useUser } from "../contexts/user.context";
import { Card, CardContent, Typography, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import AdministratorImage from '../Images/administrator.png'; // Import image for Administrator link
import UsersImage from '../Images/users.png'; // Import image for Users link

export default function Home() {
  const [view, setView] = useState(null);
  const [imageInSidebar, setImageInSidebar] = useState(false);
  // Handler for image clicks initially
  const handleImageClick = (newView) => {
    setImageInSidebar(true);
    setView(newView);
  };

  const TaskDetailsTable = ({ tasks }) => { // Tasks details in table format
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tasks</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Urgency</TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{task.task}</TableCell>
                <TableCell align="left">{new Date(task.date_of_task).toLocaleDateString()}</TableCell>
                <TableCell align="left">{task.urgency}</TableCell>
                <TableCell align="left">{task.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const ImageComponent = ({ src, alt, viewType, label }) => {
    // Check if the current view matches the image type and apply a selected class
    const isSelected = view === viewType;
  
    return (
      <div className="image-container">
        <img
          src={src}
          alt={alt}
          className={`${imageInSidebar ? 'image-sidebar' : 'image-center'} ${isSelected ? 'selected-image' : ''}`}
          onClick={() => handleImageClick(viewType)}
        />
        <Typography variant="subtitle1" className="image-label">{label}</Typography>
      </div>
    );
  };
  
  


  const UserDetails = ({ userId }) => { // Each client user details with their respective tasks
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchUserDetails = async () => {
        setLoading(true);
        try {
          console.log("Fetching user details for user ID:", userId);
          const response = await fetch(`/api/tasks/${userId}/details`);
          if (!response.ok) throw new Error('Failed to fetch user details');
          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error("Error fetching user details:", error);
          setUserDetails(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    }, [userId]);

    if (loading) return <Typography>Loading...</Typography>;
    if (!userDetails) return <Typography>No details available.</Typography>;

    return (
      <div>
        <Typography variant="h6">Email: {userDetails.email}</Typography>
        <Typography variant="subtitle1">Tasks:</Typography>
        {userDetails.tasks.map((task, index) => (
          <Typography key={index}>
            Task: {task.task}, Date: {new Date(task.date_of_task).toLocaleDateString()},
            Urgency: {task.urgency}, Status: {task.status}
          </Typography>
        ))}
      </div>
    );
  };

  const TaskUserList = () => { // Retrieve tasks
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/tasks');  // Ensure this endpoint correctly fetches basic user info
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Function to fetch detailed user data
    const fetchUserDetails = async (id) => {
        try {
            const response = await fetch(`/api/tasks/${id}/details`);
            if (!response.ok) throw new Error('Failed to fetch user details');
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    // Handle card click to toggle expand and fetch details if not already loaded
    const handleUserSelect = (id) => {
        if (selectedUserId !== id) {
            setSelectedUserId(id);
            fetchUserDetails(id);
        } else {
            setSelectedUserId(null);  // Collapse if the same user card is clicked again
        }
    };

    return ( // Renders user log page
    <div className='user-list-container'>
      <Typography variant="h6" className="log-heading">Users Log Information</Typography>
      {users.map(user => (
        <Card key={user.id} className='user-card log-card'>
          <CardContent style={{ cursor: 'pointer' }} onClick={() => handleUserSelect(user.id)}>
            <Typography variant="h5" component="div" className="log-text">{user.username}</Typography>
          </CardContent>
          <Collapse in={selectedUserId === user.id} timeout="auto" unmountOnExit>
            <CardContent className="scrollable-content">
              <Typography paragraph className="log-text">Email: {userDetails.email}</Typography>
              {userDetails.tasks && userDetails.tasks.length > 0 ? (
                <TaskDetailsTable tasks={userDetails.tasks} />
              ) : (
                <Typography>No tasks available.</Typography>
              )}
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};




  const UserList = () => { //Admin details
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null); // New state to track expanded user card

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/users/users');
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }, []);

    return (
      <div className='user-list-container'>
        <Typography variant="h6" className="log-heading">Admin Log Information</Typography>
        {users.map(user => (
          <Card key={user._id} className='user-card log-card'>
            <CardContent onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)} style={{ cursor: 'pointer' }}>
              <Typography variant="h5" component="div" className="log-text">
                {user.username}
              </Typography>
              <Typography variant="body2" className="log-text">
                Email: {user.email}
              </Typography>
            </CardContent>
            <Collapse in={expandedUserId === user._id} timeout="auto" unmountOnExit>
              <CardContent className="scrollable-content card-content-inner">
                <Typography paragraph className="log-text">Account Creation Date: {new Date(user.accountCreationDate).toLocaleDateString()}</Typography>
                <div className="session-info">
                {user.sessions.map((session, index) => (
                  <Typography key={index} className="log-text">
                    Session ID: {session.sessionId}, Login Time: {new Date(session.loginTime).toLocaleString()}
                  </Typography>
                ))}
                </div>
                
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </div>
    );
  };

  const Navbar = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="http://main-todolist-env.eba-t9v3pdyf.us-east-1.elasticbeanstalk.com/">Main Project</a>
      </div>
      <div className="navbar-right">
        <a className="Signup" href="/Signup">Signup</a>
        <a className="Logout" href="/Login">Logout</a>
      </div>
    </nav>
  );

  return (
    <>
      <div className="main-page">
        <Navbar />
        <div className="sidebar">
          {imageInSidebar && (
            <>
              <ImageComponent src={AdministratorImage} alt="Admin" viewType="admin" />
              <ImageComponent src={UsersImage} alt="Users" viewType="tasks" />
            </>
          )}
        </div>
        <div style={{ textAlign: 'center', margin: '20px' }}>
          {!imageInSidebar && (
            <div className="parent-container">
            <ImageComponent src={AdministratorImage} alt="Admin" viewType="admin" label="Administrator" />
            <ImageComponent src={UsersImage} alt="Users" viewType="tasks" label="Users" />
          </div>
          
          )}
        </div>
        {view === 'admin' && <UserList />}
        {view === 'tasks' && <TaskUserList />}
      </div>
    </>
  );
}

