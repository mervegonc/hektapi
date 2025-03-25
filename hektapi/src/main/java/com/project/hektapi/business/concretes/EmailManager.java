    package com.project.hektapi.business.concretes;

    import com.project.hektapi.business.abstracts.EmailService;
    import com.project.hektapi.dto.email.EmailRequest;
    import jakarta.mail.MessagingException;
    import jakarta.mail.internet.MimeMessage;
    import lombok.RequiredArgsConstructor;
    import org.springframework.mail.javamail.JavaMailSender;
    import org.springframework.mail.javamail.MimeMessageHelper;
    import org.springframework.stereotype.Service;

    @Service
    @RequiredArgsConstructor
    public class EmailManager implements EmailService {

        private final JavaMailSender mailSender;
        private static final String RECEIVER_EMAIL = "info@hektapi.com.tr"; // Şirket e-postası

        @Override
        public void sendEmail(EmailRequest emailRequest) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                // **DÜZELTİLDİ:** Kullanıcı emaili "From" olarak ayarlanamaz, yerine "Reply-To" kullanıldı.
                helper.setFrom(RECEIVER_EMAIL);
                helper.setReplyTo(emailRequest.getUserEmail());

                helper.setTo(RECEIVER_EMAIL);
                helper.setSubject(emailRequest.getSubject());

                String emailContent = String.format(
                    """
                    Kullanıcı E-Postası: %s
                    Ürün Adı: %s
                    Ürün Kodu: %s
                    Mesaj:
                    %s
                    """,
                    emailRequest.getUserEmail(),
                    emailRequest.getProductName(),
                    emailRequest.getProductCode(),
                    emailRequest.getMessage()
                );

                helper.setText(emailContent, false);
                mailSender.send(message);
            } catch (MessagingException e) {
                throw new RuntimeException("E-posta gönderme hatası: " + e.getMessage());
            }
        }
    }
