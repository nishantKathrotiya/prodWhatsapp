const passwordResetTemplate = (resetLink, employeeId) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Password Reset Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 12px 24px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
				margin-bottom: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}

			.warning {
				color: #ff6b6b;
				font-weight: bold;
				margin-top: 15px;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<h1>DEPSTAR</h1>
			<div class="message">Password Reset Request</div>
			<div class="body">
				<p>Dear User (Employee ID: ${employeeId}),</p>
				<p>We received a request to reset your password for your DEPSTAR account. If you made this request, please click the button below to reset your password:</p>
				
				<a href="${resetLink}" class="cta">Reset Password</a>
				
				<p>This link is valid for <span class="highlight">15 minutes</span> and can only be used once.</p>
				
				<p class="warning">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
				
				<p>For security reasons, this link will expire automatically after 15 minutes. If you need to reset your password after the link expires, please request a new password reset.</p>
			</div>
			<div class="support">
				If you have any questions or need assistance, please contact your system administrator.
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = passwordResetTemplate; 