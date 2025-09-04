export function newUserHtml(name: string, email: string): string {
  return `
    <div style="
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      padding: 30px;
      border-radius: 10px;
      border: 2px solid #2575fc;
      text-align: center;
    ">
      <h2 style="color: #2575fc; margin-bottom: 20px;">New User Joined!</h2>
      <p style="font-size: 18px; color: #333;">
        <strong>Name:</strong> ${name}
      </p>
      <p style="font-size: 18px; color: #333;">
        <strong>Email:</strong> ${email}
      </p>
    </div>
  `;
}
