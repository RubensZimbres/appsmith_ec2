export default {
	data: {
		"policy_metadata": {
			"company": "Revolut Ltd",
			"effective_date": "2020-07-30",
			"status": "Notice Present",
			"dpo_contact": "dpo@revolut.com",
			"jurisdiction": ["UK", "EEA", "Lithuania"]
		},
		"technical_data_disclosures": {
			"device_info": {
				"is_disclosed": true,
				"policy_section": "3. Information from your device",
				"allowed_items": [
					"IP address", "browser type", "timezone", "operating system",
					"IMEI number", "MAC address", "mobile phone number"
				],
				"dashboard_key_mapping": {
					"rev_cid": "Not explicitly listed (Internal identifier)",
					"rev_geo_country_code": "Covered under 'Location Services/GPS'",
					"cf_b": "Not explicitly listed (Cloudflare/Technical)",
					"cfuvid": "Covered under 'Safe' (Section 16: Cookies)"
				}
			},
			"interaction_info": {
				"is_disclosed": true,
				"allowed_items": [
					"links clicked", "page response times", "scrolling and clicks", "browsing methods"
				]
			}
		},
		"sensitive_data_inventory": {
			"identity": [
				"Passport", "Driving License", "Photo", "Video (KYC)",
				"Fingerprint Scans (Implied via Device Biometrics)"
			],
			"financial": [
				"Bank account number", "Sort code", "IBAN", "CVC", "Income details"
			],
			"credentials": [
				"Password", "Username"
			]
		},
		"third_party_egress_rules": {
			"advertising": {
				"allowed": true,
				"condition": "Hashed data only",
				"observed_risk_match": "googlesyndication.com",
				"policy_limitation": "Social media providers only allowed to use hashed personal data for custom audiences."
			},
			"analytics": {
				"allowed": true,
				"purpose": "Improve website or app"
			}
		},
		"ai_and_training_audit": {
			"ai_model_training_disclosed": false,
			"automated_decision_making": {
				"is_disclosed": true,
				"use_cases": ["Credit applications", "Opening accounts", "Fraud detection"],
				"user_right": "Request manual human review"
			},
			"anonymized_datasets": {
				"is_disclosed": true,
				"purpose": "Spending patterns forecasting and policy-making"
			}
		},
		"dashboard_compliance_mapping": [
			{
				"finding": "Account Password Leaks",
				"policy_basis": "Section 13 (Protection)",
				"compliance_status": "FAIL",
				"reasoning": "Policy requires confidential handling; extraction from JS markers indicates a security failure."
			},
			{
				"finding": "Fingerprint Scan Extraction",
				"policy_basis": "Section 3 (Identity)",
				"compliance_status": "FAIL",
				"reasoning": "Policy lists biometrics for KYC only; presence in internal proxies suggests over-exposure."
			},
			{
				"finding": "49 Training Data Leaks",
				"policy_basis": "N/A",
				"compliance_status": "CRITICAL_GAP",
				"reasoning": "2020 policy lacks an 'AI training' clause required for LLM/Model ingestion."
			}
		]
	}
}