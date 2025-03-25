package com.project.hektapi.business.abstracts;

import com.project.hektapi.dto.email.EmailRequest;

public interface EmailService {
    void sendEmail(EmailRequest emailRequest);
}
