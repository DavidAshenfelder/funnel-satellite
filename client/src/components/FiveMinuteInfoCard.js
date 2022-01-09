import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import socket from '../socket';

export default function BasicCard() {
  const [status, setStatus] = React.useState(null);

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  socket.on('satellite-update', (update) => {
    setStatus(update.status);
  });

  React.useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data)
    });
  }, []);

    let marks = []
    let minAlt = 0;
    let maxAlt = 0;
    let avgAlt = 0;

    if (status) {

      minAlt = parseFloat(status.minimumAltitude).toFixed(2);
      maxAlt = parseFloat(status.maximumAltitude).toFixed(2);
      avgAlt = parseFloat(status.averageAltitude).toFixed(2);

      marks = [
        {
          value: status.minimumAltitude,
          label: `Min Altitude ${minAlt}`,
        },
        {
          value: status.maximumAltitude,
          label: `Max Altitude ${maxAlt}`,
        },
        {
          value: status.averageAltitude,
          label: `Avg. Altitude ${avgAlt}`,
        },
      ];
    }


  function valuetext(value) {
    return `Average Altitude ${parseFloat(value).toFixed(2)}`;
  }

  const isInDanger = avgAlt < 160;
  const statusTextColor = isInDanger ? '#ea044d' : '#02eaa4';

  return (

    <Card sx={{ width: 300, height: 400, margin: '1em' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          5 Minutes Status
        </Typography>
        {!status ?
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Loading...
          </Typography>
          :
          (
            <>
              <Box sx={{ height: 250 }}>
                <Slider
                  sx={{
                    '& input[type="range"]': {
                      WebkitAppearance: 'slider-vertical',
                    },
                  }}
                  marks={marks}
                  orientation="vertical"
                  value={avgAlt}
                  aria-label="Altitude"
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  step={190}
                  max={190}
                  min={130}
                  onKeyDown={preventHorizontalKeyboardNavigation}
                />
              </Box>
              <Typography sx={{ mb: 1.5, mt: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '.9em' }} color={statusTextColor}>
              { isInDanger ?
                <WarningAmberIcon color='red' fontSize="large"/>
                :
                <CheckCircleOutlineIcon fontSize="large"/>
              }
                <div style={{marginTop: '1px'} }>{status.message}</div>
              </Typography>
            </>
          )
        }
      </CardContent>
    </Card>
  );
}
