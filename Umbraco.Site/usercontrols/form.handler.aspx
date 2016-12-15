using RestSharp.Authenticators;

bool isSuccess = false;

	client.SendMail(new System.Net.Mail.MailMessage("gino@samples.mailgun.org", "gino.heyman@gmail.com") 
	{
	    Subject = "Hello from mailgun",
	    Body = "this is a test message from mailgun."
	    isSuccess = true;
	});
<%=isSuccess.ToString().ToLower()%>