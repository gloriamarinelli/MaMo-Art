testo = "The Manhattan Transcripts Project, New York, New York, Introductory panel to Episode 1: The Park"
testo1 = "The Manhattan Transcripts Project, New York, New York , Introductory panel to Episode 1: The Park"

# Rimuovere gli spazi prima delle virgole
pulito = testo.replace(' ,', ',')
pulito1 = testo1.replace(' ,', ',')

print(f"{pulito}")
print(f"{pulito1}")
