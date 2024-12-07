export const styles = {
  wrapper: {
    padding: 0,
    margin: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: { xs: "column", md: "row" }, 
    overflow: "hidden",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingLeft: "0.5rem",
    paddingTop: "0.5rem",
    paddingRight: "1rem",
    overflowY: "auto",
    scrollbarWidth: "none", 
    msOverflowStyle: "none",
    '&::-webkit-scrollbar': {
      display: 'none', 
    },
  },
  formContainer: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-between",
    width: "100%",
    gap: 2,
    backgroundColor: "transparent",
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', 
      },
      '&:hover fieldset': {
        borderColor: 'white', 
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', 
      },
    },
  },
  dateFields: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    width: "100%",
    backgroundColor: "transparent",
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', 
      },
      '&:hover fieldset': {
        borderColor: 'white', 
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', 
      },
    },
  },
  flightsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 2,
  },
  flightCard: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: "100%",
    borderRadius: 2,
    boxShadow: 3,
    overflow: 'hidden',
    backgroundColor: (theme) => theme.palette.background.default,
    color: 'white',
    '&:hover': {
      boxShadow: 6,
      transform: 'scale(1.03)',
      transition: 'all 0.3s ease',
    },
  },
  cardContent: {
    padding: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    mb: 1,
  },
  cardSubtitle: {
    color: 'grey',
  },
  flightInfo: {
    display: 'flex',
    alignItems: 'center',
    mt: 2,
  },
  flightIcon: {
    mr: 1,
    color: (theme) => theme.palette.secondary.main,
  },
  durationInfo: {
    display: 'flex',
    alignItems: 'center',
    mt: 1,
  },
  durationIcon: {
    mr: 1,
    color: (theme) => theme.palette.secondary.main,
  },
  mapContainer: {
    width: "100%",
    overflow: "hidden",
    marginTop: { xs: 1, md: 0 },
  }
};
