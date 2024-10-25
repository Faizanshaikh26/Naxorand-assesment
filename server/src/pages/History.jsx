import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { server } from '../constants/server';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function History() {
  const [open, setOpen] = React.useState(false);
  const [historyData, setHistoryData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleClickOpen = async () => {
    setOpen(true);
    await fetchUserHistory();
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const fetchUserHistory = async () => {
    setLoading(true);
    setError(null);
    try {
        
        const email = localStorage.getItem("email");
       
        if (!email) {
            throw new Error("Email not found in local storage.");
        }

        const response = await axios.post(`${server}/api/user/v1/your-history`, { email });
        
       
        if (response.data.success) {
            setHistoryData(response.data.data);
        } else {
            throw new Error(response.data.message || "Failed to fetch user history.");
        }
    } catch (err) {
        console.error("Error fetching user history:", err);
        setError("Failed to fetch user history.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open History
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              History
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        {loading ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        ) : (
          <List>
            {historyData.map((item, index) => (
              <React.Fragment key={index}>
                <ListItemButton>
                  <ListItemText primary={`Points Awarded: ${item.pointsAwarded}`} secondary={`Date: ${item.date}`} />
                </ListItemButton>
                {index < historyData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Dialog>
    </div>
  );
}

export default History;
