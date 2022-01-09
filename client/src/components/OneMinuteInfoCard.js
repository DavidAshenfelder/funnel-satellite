import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import socket from '../socket';


export default function BasicCard() {
  const [health, setHealth] = React.useState(null);

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  socket.on('satellite-update', (update) => {
    setHealth(update.health);
  });

  React.useEffect(() => {
    fetch("/health")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data)
    });
  }, []);

    let marks = []
    let minAlt = 0;
    let maxAlt = 0;
    let avgAlt = 0;

    if (health) {
      avgAlt = parseFloat(health.averageAltitude).toFixed(2);

      marks = [
        {
          value: 160,
          label: 'Danger Altitude 160km',
        },
      ];
    }


  function valuetext(value) {
    return `Average Altitude ${parseFloat(value).toFixed(2)}km`;
  }

  const isInDanger = avgAlt < 160;
  const statusTextColor = isInDanger ? '#ea044d' : '#02eaa4';

  return (

    <Card sx={{ width: 300, height: 400, margin: '1em' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          1 Minutes Health
        </Typography>
        {!health ?
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
              <Typography sx={{ mb: 1.5, mt: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1em' }} color={statusTextColor}>
              { isInDanger ?
                <WarningAmberIcon fontSize="large"/>
                :
                <CheckCircleOutlineIcon fontSize="large"/>
              }
                {health.message}
              </Typography>
            </>
          )
        }
      </CardContent>
    </Card>
  );
}
