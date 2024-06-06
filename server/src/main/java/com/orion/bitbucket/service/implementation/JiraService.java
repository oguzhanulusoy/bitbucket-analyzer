package com.orion.bitbucket.service.implementation;

import com.orion.bitbucket.helper.JiraData;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * "Search in API" Feature
 *
 * This feature allows users to query Jira data by entering a specific Jira ID.
 * It fetches data from the Jira API and displays it on the user interface.
 *
 * Purpose:
 * - Enable users to query data based on a specific Jira ID.
 * - Fetch and display Jira data such as open and merged issue counts.
 *
 * Functionality:
 * - Users enter a Jira ID in the frontend input field.
 * - The frontend sends this Jira ID to the backend.
 * - The backend sends a request to the Jira API and retrieves data in JSON format.
 * - The retrieved data is processed to extract necessary fields (e.g., openCount, mergedCount).
 * - This data is then sent back to the frontend and displayed to the user.
 *
 * Demo and Development:
 * - This feature is designed as a demo or preliminary work to see if it's possible to fetch more detailed data from the API.
 * - Additional data fields can be added for further development.
 * - Error handling can be improved to provide more detailed feedback to users.
 * - Security and performance enhancements can be implemented.
 */

@Service
public class JiraService {

    public JiraData sendRequest(String jiraID) {

        String apiUrl = "https://jira.rbbn.com/rest/api/2/issue/{placeholder}";
        String finalUrl = apiUrl.replace("{placeholder}", jiraID);

        // get a new token if it has expired
        String authToken = "NzQzNDcwOTcwNDY5OvQOT4Ier1losj4GLdVdTLerQN6q";

        try {
            URL url = new URL(finalUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            connection.setRequestProperty("Authorization", "Bearer " + authToken);

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            return filterData(response.toString());

        } catch (IOException e) {
            System.out.println("Connection failed. The API token might be expired.");
            return null;
        }
    }

    public JiraData filterData(String jsonResponse) {
        try {
            JSONObject jsonObject = new JSONObject(jsonResponse);

            JSONObject fields = jsonObject.getJSONObject("fields");

            String customField10000 = fields.getString("customfield_10000");

            long openCount = extractOpenCount(customField10000);

            long mergedCount = extractMergedCount(customField10000);

            return new JiraData(openCount, mergedCount);

        } catch (JSONException e) {
            return null;
        }
    }

    private static int extractOpenCount(String customField10000) {
        Pattern pattern = Pattern.compile("\"openCount\":(\\d+)");
        Matcher matcher = pattern.matcher(customField10000);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return -1;
    }

    private static int extractMergedCount(String customField10000) {
        Pattern pattern = Pattern.compile("\"mergedCount\":(\\d+)");
        Matcher matcher = pattern.matcher(customField10000);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return -1;
    }
}
