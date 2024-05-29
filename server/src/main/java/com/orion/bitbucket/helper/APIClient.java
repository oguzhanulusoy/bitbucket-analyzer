package com.orion.bitbucket.helper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONException;
import org.json.JSONObject;

public class APIClient {

    public static void main(String[] args) {
        sendRequest("AAK-93199");
    }

    public static void sendRequest(String jiraID) {

        String apiUrl = "https://jira.rbbn.com/rest/api/2/issue/{placeholder}";
        String finalUrl = apiUrl.replace("{placeholder}", jiraID);

        // get a new token if it has expired
        String authToken = "Njk2MzA4ODc2Mjk0Ot7nbFz6QMYxTGCkp/JylvxKeCw+";

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

            filterData(response.toString());

        } catch (IOException e) {
            System.out.println("Connection failed. The API token might be expired.");
            e.printStackTrace();
        }
    }

    public static void filterData(String jsonResponse) {
        try {
            JSONObject jsonObject = new JSONObject(jsonResponse);

            JSONObject fields = jsonObject.getJSONObject("fields");

            String customField10000 = fields.getString("customfield_10000");

            int openCount = extractOpenCount(customField10000);
            System.out.println("Open Count: " + openCount);

            int mergedCount = extractMergedCount(customField10000);
            System.out.println("Merged Count: " + mergedCount);

        } catch (JSONException e) {
            e.printStackTrace();
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