import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

/*
  O cliente deve ser maior de 18 anos.
  Por isso, para validar a data de nascimento, calculamos
  a data máxima até a qual o cliente pode ter nascido (no
  passado) para ter, pelo menos, 18 anos na data atual
*/
const maxBirthDate = new Date()   // Hoje
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18)

// O cliente pode ter, no máximo, 120 anos de idade
const minBirthDate = new Date()
minBirthDate.setFullYear(minBirthDate.getFullYear() - 120)

// Unidades da Federação
const unidadesFederacao = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const Customer = z.object({
  name: z.string()
    .trim()
    .min(5, { message: 'O nome deve ter, no mínimo, 5 caracteres.' })
    .max(100, { message: 'O nome deve ter, no máximo, 100 caracteres.' })
    .includes(' ', { message: 'O nome deve ter um espaço em branco separando prenome e sobrenome.' }),

  ident_document: z.string()
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 14, {
      message: 'O CPF deve ter, exatamente, 14 caracteres.'
    })
    .refine(val => cpf.isValid(val), {
      message: 'CPF inválido.'
    }),

  birth_date: z.coerce.date()
    .min(minBirthDate, {
      message: 'Data de nascimento está muito no passado.'
    })
    .max(maxBirthDate, {
      message: 'O cliente deve ser maior de 18 anos.'
    })
    .nullish(),

  street_name: z.string()
    .trim()
    .min(1, { message: 'Logradouro deve ter, pelo menos, 1 caractere.' })
    .max(40, { message: 'Logradouro pode ter, no máximo, 40 caracteres.' }),

  house_number: z.string()
    .trim()
    .min(1, { message: 'O número do imóvel deve ter, pelo menos, 1 caractere.' })
    .max(10, { message: 'O número do imóvel pode ter, no máximo, 10 caracteres.' }),

  complements: z.string()
    .trim()
    .max(20, { message: 'Complemento pode ter, no máximo, 20 caracteres.' })
    .nullish(),

  district: z.string()
    .trim()
    .min(1, { message: 'Bairro deve ter, no mínimo, 1 caractere.' })
    .max(25, { message: 'Bairro pode ter, no máximo, 25 caracteres.' }),

  municipality: z.string()
    .trim()
    .min(1, { message: 'Município deve ter, no mínimo, 1 caractere.' })
    .max(40, { message: 'Município pode ter, no máximo, 40 caracteres.' }),

  state: z.enum(unidadesFederacao, {
    message: 'Unidade da Federação inválida.'
  }),

  phone: z.string()
    .transform(val => val.replace('_', ''))
    .refine(val => val.length === 15, {
      message: 'O número do telefone/celular deve ter exatas 15 posições.'
    }),

  email: z.string()
    .email({ message: 'E-mail inválido.' })
})

export default Customer

