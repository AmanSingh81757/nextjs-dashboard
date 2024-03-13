import fetch from 'node-fetch';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import 'dotenv/config';

async function getElectricityBalance() {
  const response = await fetch('https://paytm.com/papi/digitalrecharge/v1/expressrecharge/verify?payment_info=1&native_withdraw=1&payment_info_version=2&channel=web&version=2&child_site_id=1&site_id=1&locale=en-in&client=WEB', {
      method: 'POST',
      headers: {
        'authority': 'paytm.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json; charset=utf-8',
        'cookie': '__cf_bm=VEvFgT0BfkrEpOxLHtounvIRyEsRwgpDpUByOiPtlTQ-1710152959-1.0.1.1-LHtwQ_xCQjNkUcOgoVFQM7Q.39X0JOyvup6KZ4GcQ5huLdpchOMvvvSLnHcSmW.6CR64GvYn7Usg0IQuiNohDA; _cfuvid=tRIMEofmKwnZhym5M4.ZekllMqGz3Zsb4wVdkkR2nqM-1710152959920-0.0.1.1-604800000; signalSDKVisitorId=364ab8f0-df92-11ee-916c-f3f1271bf114; connect.sid=s%3AyNYZ3awGY7Fos0Q_Y-pbYwHqy1TMqzp9.x7PtOJJA1bfdF245qumpTCPA2rmm7fu%2FVCe81tX%2BFxM; XSRF-TOKEN=X5uHcDm3-xFNsxcdHJEFI0FFMfKpOczQ3wrQ',
        'dnt': '1',
        'origin': 'https://paytm.com',
        'referer': 'https://paytm.com/electricity-bill-payment',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'x-csrf-token': 'X5uHcDm3-xFNsxcdHJEFI0FFMfKpOczQ3wrQ',
        'x-xsrf-token': 'X5uHcDm3-xFNsxcdHJEFI0FFMfKpOczQ3wrQ'
      },
      body: JSON.stringify({
        'cart_items': [
          {
            'product_id': 326193873,
            'qty': 1,
            'configuration': {
              'price': 10,
              'recharge_number': `5-1202`
            },
            'meta_data': {
              'city': 'Faridabad',
              'society': 'Aagman Society',
              'utility_type_1': 'Electricity',
              'utility_type': 'N/A',
              'protection_url': 'https://paytm.com/protection/v2/public/attachment/policies?categoryId=101950',
              'newVerify': true
            }
          }
        ]
      })
    });
    const data = await response.json();
    return data.cart.cart_items[0].meta_data.due_amount;
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amansinghgdsc@gmail.com',
    pass: 'ppgu rrmf crck qmcm',
  },
});

// Function to send an email
function sendEmail(balance) {
  const mailOptions = {
    from: 'amansinghgdsc@gmail.com',
    to: 'amansinghgdsc@gmail.com',
    subject: 'Daily Electricity Balance Alert',
    text: `Your electricity balance is ${balance}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Schedule the task to run every morning at 8 AM
export async function getBalance(){
  cron.schedule('11 20 * * *', async () => {
    try {
      const balance = await getElectricityBalance();
      sendEmail(balance);
    } catch (error) {
      console.error('Error fetching electricity balance:', error.message);
    }
  });
}