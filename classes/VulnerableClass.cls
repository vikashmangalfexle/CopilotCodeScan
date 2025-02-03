public class VulnerableClass {
    
    // Hardcoded API Key - Security Risk
    private static final String API_KEY = 'sk_test_1234567890abcdef';
    
    // Hardcoded Database Credentials - Security Risk
    private static final String DB_USERNAME = 'admin';
    private static final String DB_PASSWORD = 'password123';

    // SOQL Injection Risk: Accepting raw user input directly in query
    public static List<Contact> getContacts(String userInput) {
        String query = 'SELECT Id, Name FROM Contact WHERE Name LIKE \'%' + userInput + '%\'';
        return Database.query(query);
    }

    // Insecure HTTP Callout - No TLS validation
    public static void makeHttpCallout() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('http://example.com/api/data');  // Uses HTTP instead of HTTPS
        req.setMethod('GET');
        req.setHeader('Authorization', 'Bearer ' + API_KEY);

        Http http = new Http();
        HttpResponse res = http.send(req);
    }
}