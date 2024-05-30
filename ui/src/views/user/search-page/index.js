import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setSearchResults(null);
        setError(null);
        setIsLoading(true);
        const jiraData = await axios("http://localhost:8989/api/v1/jira/" + searchQuery)
        setIsLoading(false);
        setSearchResults(jiraData.data);
    };

    const boxStyle = {
      width: '300px',
      backgroundColor: '#e0f7fa',
      border: '2px solid #00838f',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      fontSize: '14px',
      color: '#006064',
      margin: '20px 0',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
    };

    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <div style={{ marginTop: '16px' }}>
                    <input
                        type="text"
                        placeholder="Please enter the Jira ID of your API:"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        style={{ borderRadius: '4px', padding: '8px', marginRight: '8px', border: '1px solid #ced4da', width: '300px' }}
                    />
                </div>
                <div style={{ marginTop: '8px' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ borderRadius: '4px' }}
                    >
                        Search
                    </Button>
                </div>
            </form>
            {isLoading && (
                <div style={boxStyle}>
                    <p>Loading...</p>
                </div>
            )}
            {searchResults && (
                <div style={boxStyle}>
                    <h2>Search Results</h2>
                    <p>Open Count: {searchResults.openCount}</p>
                    <p>Merged Count: {searchResults.mergedCount}</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;