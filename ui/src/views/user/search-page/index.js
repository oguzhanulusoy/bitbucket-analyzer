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
        try {
            // APIClient.sendRequest(searchQuery)
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
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
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {searchResults && (
                <div>
                    <h2>Search Results</h2>
                    <p>Open Count: {searchResults.openCount}</p>
                    <p>Merged Count: {searchResults.mergedCount}</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;