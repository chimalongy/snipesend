


export const apiSumary={
    register:"/api/auth/register",
    forgot_password:"/api/auth/forgot-password",
    verify_otp:"/api/auth/verify-otp",
    reset_password:'/api/auth/reset-password',
    login:'/api/auth/login',


    //DASHBOARD ROUTES

    get_user_emails:"/api/dashboard/emails/get-all-user-emails",
    update_email:"/api/dashboard/emails/update-email",
    delete_email:"/api/dashboard/emails/delete",

    create_campaign:"/api/dashboard/outbounds/add",
    get_user_outbounds:"/api/dashboard/outbounds/get-all-user-outbounds"

}